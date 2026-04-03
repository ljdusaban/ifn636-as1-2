const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Product = require('../models/Product');
const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/inventoryController');

const { expect } = chai;
chai.use(chaiHttp);

let server;
let port;

describe('CreateProduct Function Test', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should create a new product successfully', async () => {
        const req = {
            user: { id: new mongoose.Types.ObjectId(), role: 'admin' },
            body: {
                sku: 'TSH-001',
                productName: 'T-Shirt',
                unitPrice: 35.5,
                stockQty: 12,
                size: 'M',
                colour: 'Blue',
                image: 'https://example.com/shirt.jpg',
                lowStockThreshold: 3
            }
        };

        const createdProduct = {
            _id: new mongoose.Types.ObjectId(),
            ...req.body,
            totalValue: req.body.unitPrice * req.body.stockQty,
            createdBy: req.user.id
        };

        sinon.stub(Product, 'findOne').resolves(null);
        const createStub = sinon.stub(Product, 'create').resolves(createdProduct);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await createProduct(req, res);

        expect(createStub.calledOnce).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWith(createdProduct)).to.be.true;
    });

    it('should return 400 if required fields are missing', async () => {
        const req = {
            user: { id: new mongoose.Types.ObjectId(), role: 'admin' },
            body: {
                sku: '',
                productName: '',
                unitPrice: undefined,
                stockQty: undefined,
                size: '',
                colour: '',
                lowStockThreshold: undefined
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await createProduct(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'Please fill all required fields.' })).to.be.true;
    });

    it('should return 400 if SKU already exists', async () => {
        const req = {
            user: { id: new mongoose.Types.ObjectId(), role: 'admin' },
            body: {
                sku: 'TSH-001',
                productName: 'T-Shirt',
                unitPrice: 35.5,
                stockQty: 12,
                size: 'M',
                colour: 'Blue',
                lowStockThreshold: 3
            }
        };

        sinon.stub(Product, 'findOne').resolves({ _id: new mongoose.Types.ObjectId(), sku: 'TSH-001' });

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await createProduct(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({ message: 'SKU already exists.' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
        const req = {
            user: { id: new mongoose.Types.ObjectId(), role: 'admin' },
            body: {
                sku: 'TSH-001',
                productName: 'T-Shirt',
                unitPrice: 35.5,
                stockQty: 12,
                size: 'M',
                colour: 'Blue',
                lowStockThreshold: 3
            }
        };

        sinon.stub(Product, 'findOne').throws(new Error('DB Error'));

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await createProduct(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
});

describe('GetProducts Function Test', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return products successfully', async () => {
        const products = [
            { _id: new mongoose.Types.ObjectId(), sku: 'TSH-001', productName: 'T-Shirt' },
            { _id: new mongoose.Types.ObjectId(), sku: 'DRS-001', productName: 'Dress' }
        ];

        const sortStub = sinon.stub().resolves(products);
        const findStub = sinon.stub(Product, 'find').returns({ sort: sortStub });

        const req = { query: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await getProducts(req, res);

        expect(findStub.calledOnceWith({})).to.be.true;
        expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(products)).to.be.true;
    });

    it('should apply keyword and price filter', async () => {
        const products = [];
        const sortStub = sinon.stub().resolves(products);
        const findStub = sinon.stub(Product, 'find').returns({ sort: sortStub });

        const req = {
            query: {
                keyword: 'shirt',
                size: 'M',
                unitPrice: '20',
                priceFilter: 'gte'
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await getProducts(req, res);

        expect(findStub.calledOnce).to.be.true;
        const filterArg = findStub.firstCall.args[0];
        expect(filterArg.size).to.equal('M');
        expect(filterArg.unitPrice).to.deep.equal({ $gte: 20 });
        expect(filterArg.$or).to.be.an('array').with.lengthOf(2);

        expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 500 on error', async () => {
        sinon.stub(Product, 'find').throws(new Error('DB Error'));

        const req = { query: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await getProducts(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
});

describe('UpdateProduct Function Test', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should update product successfully as admin', async () => {
        const productId = new mongoose.Types.ObjectId();

        const existingProduct = {
            _id: productId,
            sku: 'TSH-001',
            productName: 'Old Name',
            unitPrice: 20,
            stockQty: 5,
            size: 'M',
            colour: 'Blue',
            image: '',
            lowStockThreshold: 2,
            save: sinon.stub().resolvesThis()
        };

        sinon.stub(Product, 'findById').resolves(existingProduct);
        sinon.stub(Product, 'findOne').resolves(null);

        const req = {
            params: { id: productId.toString() },
            user: { role: 'admin' },
            body: {
                sku: 'TSH-001',
                productName: 'New Name',
                unitPrice: 30,
                stockQty: 9,
                size: 'L',
                colour: 'Red',
                lowStockThreshold: 3
            }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateProduct(req, res);

        expect(existingProduct.productName).to.equal('New Name');
        expect(existingProduct.stockQty).to.equal(9);
        expect(existingProduct.lowStockThreshold).to.equal(3);
        expect(existingProduct.save.calledOnce).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
    });

    it('should allow staff to update lowStockThreshold but not quantity', async () => {
        const productId = new mongoose.Types.ObjectId();

        const existingProduct = {
            _id: productId,
            sku: 'TSH-001',
            productName: 'T-Shirt',
            unitPrice: 20,
            stockQty: 5,
            size: 'M',
            colour: 'Blue',
            image: '',
            lowStockThreshold: 2,
            save: sinon.stub().resolvesThis()
        };

        sinon.stub(Product, 'findById').resolves(existingProduct);

        const req = {
            params: { id: productId.toString() },
            user: { role: 'staff' },
            body: { lowStockThreshold: 7 }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateProduct(req, res);

        expect(existingProduct.lowStockThreshold).to.equal(7);
        expect(existingProduct.stockQty).to.equal(5);
        expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 403 when staff tries to update quantity', async () => {
        const productId = new mongoose.Types.ObjectId();

        sinon.stub(Product, 'findById').resolves({
            _id: productId,
            save: sinon.stub().resolvesThis()
        });

        const req = {
            params: { id: productId.toString() },
            user: { role: 'staff' },
            body: { stockQty: 10 }
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateProduct(req, res);

        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWith({ message: 'Staff are not allowed to adjust quantity.' })).to.be.true;
    });

    it('should return 404 if product not found', async () => {
        sinon.stub(Product, 'findById').resolves(null);

        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() },
            user: { role: 'admin' },
            body: {}
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateProduct(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Product not found.' })).to.be.true;
    });

    it('should return 500 on error', async () => {
        sinon.stub(Product, 'findById').throws(new Error('DB Error'));

        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() },
            user: { role: 'admin' },
            body: {}
        };

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateProduct(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
});

describe('DeleteProduct Function Test', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should delete product successfully', async () => {
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        const product = { deleteOne: sinon.stub().resolves() };
        const findByIdStub = sinon.stub(Product, 'findById').resolves(product);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteProduct(req, res);

        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(product.deleteOne.calledOnce).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({ message: 'Product deleted successfully.' })).to.be.true;
    });

    it('should return 404 if product not found', async () => {
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        sinon.stub(Product, 'findById').resolves(null);

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteProduct(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Product not found.' })).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
        sinon.stub(Product, 'findById').throws(new Error('DB Error'));

        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await deleteProduct(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
});
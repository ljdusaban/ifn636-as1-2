
**Assessment 1.2**

Name: Leo John Dusaban
Id: N12403202

Assignment: **Software requirements analysis and design (**Full-Stack CRUD Application Development with DevOps Practices**)**


---

**Overview**

This app is about a Clothing Store Inventory System implementing CRUD (Create, Read, Update, Delete) operations. The system includes a staff panel and an admin panel and the main products list. The project code was initially based off the starter project provided that includes user authentication using Node.js, React.js, and MongoDB.
 
---

**Instructions for access and use:**

**GitHub link:** [https://github.com/ljdusaban/ifn636-as1-2](https://github.com/ljdusaban/ifn636-as1-2.git)
**AWS EC2 Instance:** (id: i-0dc4b3eb92ba0fb93, name: LJD_IFN636)
**Public URL:** [http://3.106.216.141](http://3.106.216.141)

**Project Setup**

Prerequisities
1. Node.js (v22 or v24)
2. Git

Installation
1. Clone the repository (in CLI)
git clone https://github.com/ljdusaban/ifn636-as1-2.git
cd ifn636-as1-2

2. Install backend dependencies
cd backend
npm install

3. Install frontend dependencies
cd ../frontend
npm install

4. Run the application
cd ..
npm start

5. Use the application
Open browser and go to http://localhost:3000

6. To login
As admin user
Username: admin1
Password: adminpass1

As staff
Username: user1
Password: trytrytry

Or register and create your own account

**Project Public URL**

AWS EC2 Instance
1. Access EC2 instance (id: i-0dc4b3eb92ba0fb93, name: LJD_IFN636)
2. Go to Security, select Security group
3. Add Inbound rules
- Type: SSH, Source: My IP
- Type: RDP, Source: My IP
- Type: Custom TCP, Port: 5001, Source: My IP
- Type: HTTP, Source: My IP
I tried adding HTTP and Custom TCP as Inbound rules Anywhere-IPv4 but it doesn't save

Access deployed app
1. Use internet browser (incognito mode recommended). Tested in Edge and Firefox.
2. In the URL bar, type in http://3.106.216.141
3. To login:
As admin user
Username: admin1
Password: adminpass1

As staff
Username: user1
Password: trytrytry

Or register and create your own account

---


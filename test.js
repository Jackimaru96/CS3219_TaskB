const chai = require("chai");
const chaiHTTP = require("chai-http");
const like = require("chai-like");
const server = require("./index.js");

chai.should();
chai.use(chaiHTTP);
chai.use(like);


const { expect } = chai;

const ContactModel = require("./contactModel.js");

describe('REST API', () => {
  let contactID;
  const sampleContact = {
    name: "Jack",
    gender: "Male",
    email: "jack@gmail.com",
    phone: "9111 1234",
  };

  const updateSampleContact = {
    name: "Jackimaru",
    email: "jackimaru@gmail.com",
  }

  const sampleContact2 = {
    name: "Jill",
    gender: "Female",
    email: "jill@gmail.com",
    phone: "9111 1235",
  };

  const addContact = {
    name: "Thomas",
    gender: "Male",
    email: "thomas@gmail.com",
    phone: "9111 1236",
  }

  before((done) => {
    // Remove previously added contacts
    ContactModel.remove({}, (err) => {
      done();
    });

    // Add sampleContact
    var addSampleContact = new ContactModel();
    addSampleContact.name = "Jack";
    addSampleContact.gender = "Male";
    addSampleContact.email = "jack@gmail.com";
    addSampleContact.phone = "9111 1234";
    addSampleContact.save();

    // add sampleContact2
    var addAnotherContact = new ContactModel();
    addAnotherContact.name = "Jill";
    addAnotherContact.gender = "Female";
    addAnotherContact.email = "jill@gmail.com";
    addAnotherContact.phone = "9111 1235";
    addAnotherContact.save();

  })
  
  /**
   * Test GET
   */
  describe("GET /api/contacts", () => {
    it("should GET all the contacts", (done) =>{
      chai.request(server)
        .get("/api/contacts")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.like([sampleContact, sampleContact2]);
            contactID = res.body.data[0]["_id"];
            done();
        });
    });
  });
  /**
    * Test GET (by id)
    */
  describe("GET /api/contacts/_id", () => {
    it("should GET a specific contact", (done) =>{
      chai.request(server)
        .get("/api/contacts/" + contactID)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.like(sampleContact);
            done();
        });
    });
  });

  /**
    * Test POST
    */
  describe("POST /api/contacts", () => {
    it("should POST a new contact", (done) =>{
      chai.request(server)
        .post("/api/contacts/")
        .send(addContact)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.like(addContact);
            done();
        });
    });
  });

  /**
   * Show that Contact added successfully; contains sampleContact, sampleContact2 and addContact
   */
  describe("GET /api/contacts", () => {
    it("should GET correct contacts after previous contact added", (done) =>{
      chai.request(server)
        .get("/api/contacts")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.like([sampleContact, sampleContact2, addContact]);
            contactID = res.body.data[0]["_id"];
            done();
        });
    });
  });

  /**
   * Test PUT
   */
  describe("POST /api/contacts/_id", () => {
    it("should update a contact", (done) =>{
      chai.request(server)
        .put("/api/contacts/" + contactID)
        .send(updateSampleContact)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.like(updateSampleContact);
            done();
        });
    });
  });


  /**
   * Test DELETE 
   */
  describe("DELETE /api/contacts/_id", () => {
    it("should delete a contact", (done) =>{
      chai.request(server)
        .delete("/api/contacts/" + contactID)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.message.should.be.like("Contact deleted");
            done();
        });
    });
  });

  /**
   * Show that Contact deleted successfully; left sampleContact2 and addContact only
   */
  describe("GET /api/contacts", () => {
    it("should GET all the contacts after deleting previous contact", (done) =>{
      chai.request(server)
        .get("/api/contacts")
        .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.like([sampleContact2, addContact]);
            contactID = res.body.data[0]["_id"];
            done();
        });
    });
  });

});
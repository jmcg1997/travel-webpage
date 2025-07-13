const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const BASE_URL = 'http://localhost:5001';

describe('🌍 Travel Web API - Public Endpoints', () => {
  it('GET /api/destinations should return an array of destinations', (done) => {
    chai.request(BASE_URL)
      .get('/api/destinations')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        if (res.body.length > 0) {
          expect(res.body[0]).to.have.property('name');
        }
        done();
      });
  });

  it('GET /api/quote should return a quote object', (done) => {
    chai.request(BASE_URL)
      .get('/api/quote')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('quote');
        expect(res.body).to.have.property('author');
        done();
      });
  });

  it('GET / should return a welcome message', (done) => {
    chai.request(BASE_URL)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.contain('Travel Web API is running');
        done();
      });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
const cookieSession = require('cookie-session');
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      cookieSession({
        keys: ['asdfasdf'],
      }),
    );
    await app.init();
  });

  it('handles a signup request', async () => {
    const email = 'asdlkq4321@akl.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'alskdfjl' });

    expect(res.status).toBe(201);
    const { id, email: returnedEmail } = res.body;
    expect(id).toBeDefined();
    expect(returnedEmail).toEqual(email);
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'asdf@asdf.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'asdf' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie as string[])
      .expect(200);

    expect(body.email).toEqual(email);
  });
});

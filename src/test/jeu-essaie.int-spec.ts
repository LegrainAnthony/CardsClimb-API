import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { PrismaService } from '../db/prisma.service';
import { Prisma } from '@prisma/client';
import { BoxesService } from 'src/boxes/boxes.service';

describe('Authentication Module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let boxesService: BoxesService;
  let accessT: string;
  let refreshT: string;
  let userId: number;
  let revisionCards: Prisma.CardUpdateInput;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    boxesService = moduleFixture.get<BoxesService>(BoxesService);
    prisma = app.get(PrismaService);

    // Initialise la connexion à la base de données
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  // Test d'inscription d'un utilisateur
  it('should sign up a new user', async () => {
    const userPayload = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'StrongPassword123!',
    };

    const response = await request(app.getHttpServer())
      .post('/authentication/sign-up')
      .send(userPayload)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  // Se connecter avec user existant
  it('should sign in the user and return tokens', async () => {
    const signInPayload = {
      email: 'test3@gmail.com',
      password: 'Password@test1!',
    };

    const response = await request(app.getHttpServer())
      .post('/authentication/sign-in')
      .send(signInPayload)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');

    accessT = response.body.accessToken;
    refreshT = response.body.refreshToken;
  });

  // Test de récupération des informations utilisateur avec un vrai token
  it('should retrieve the current user with valid access and refresh tokens', async () => {
    const awaitedId = 3;
    const response = await request(app.getHttpServer())
      .get('/authentication/current')
      .set('Authorization', `Bearer ${accessT}`)
      .set('refreshtoken', `Bearer ${refreshT}`)
      .expect(HttpStatus.OK);

    expect(response.body).toHaveProperty('id', awaitedId);
    expect(response.body).toHaveProperty('email', 'test3@gmail.com');

    userId = response.body.id;
  });

  // Test de récupération des informations utilisateur avec un faux token
  it('should fail to retrieve the current user with a fake token', async () => {
    // Header: {"alg": "HS256", "typ": "JWT"}
    // Payload: {"id": 3}
    // signature : ??
    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cGMHEG9WFX1TiiUc1oyrJe0mOBOALWB6Jkam1VpQFSg';
    const awaitedStatus = 3;
    await request(app.getHttpServer())
      .get('/authentication/current')
      .set('Authorization', `Bearer ${fakeToken}`)
      .set('refreshtoken', `Bearer ${refreshT}`)
      .expect(awaitedStatus);
  });

  // Test de récupération des cartes du jours de l'utilisateur.
  it('should get all cards of the day', async () => {
    const response = await request(app.getHttpServer())
      .get('/cards/user/revision-of-day')
      .set('Authorization', `Bearer ${accessT}`)
      .set('refreshtoken', `Bearer ${refreshT}`)

      .expect(HttpStatus.OK);

    const expectedSize = 6;
    expect(response.body.length).toBe(expectedSize);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((card) => {
      expect(card).toHaveProperty('user_id', userId);
    });

    revisionCards = response.body;
  });

  it('should validate the first card of the day', async () => {
    const cardToReview = revisionCards[0];
    const { box_steps } = await boxesService.getBoxWithBoxSteps(
      cardToReview.box_id,
      userId,
    );
    const currentBoxStep = box_steps.find(
      (boxStep) => boxStep.id === cardToReview.box_step_id,
    );

    const futurBoxStep = box_steps.find(
      (boxStep) => currentBoxStep!.order + 1 === boxStep.order,
    );

    const status = { status: 'passed' };

    const response = await request(app.getHttpServer())
      .patch(`/cards/validate/${cardToReview.id}`)
      .send(status)
      .set('Authorization', `Bearer ${accessT}`)
      .set('refreshtoken', `Bearer ${refreshT}`)
      .expect(HttpStatus.OK);

    expect(response.body.box_step_id).toBe(futurBoxStep?.id);
  });

  it('should have 1 less cards of the day', async () => {
    const response = await request(app.getHttpServer())
      .get('/cards/user/revision-of-day')
      .set('Authorization', `Bearer ${accessT}`)
      .set('refreshtoken', `Bearer ${refreshT}`)

      .expect(HttpStatus.OK);

    const expectedSize = 5;
    expect(response.body.length).toBe(expectedSize);

    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((card) => {
      expect(card).toHaveProperty('user_id', userId);
    });
  });

  it('should create a card', async () => {
    const cardPayload = {
      reference: 'test',
      question: 'Test Card',
      answer: 'This is a test card.',
      cardTypeId: 1,
      tagIds: [],
    };

    const response = await request(app.getHttpServer())
      .post('/cards')
      .set('Authorization', `Bearer ${accessT}`)
      .set('refreshtoken', `Bearer ${refreshT}`)
      .send(cardPayload)
      .expect(HttpStatus.CREATED);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('question');
    expect(response.body).toHaveProperty('answer');
    expect(response.body).toHaveProperty('last_revision', null);
    expect(response.body).toHaveProperty('future_revision', null);
    expect(response.body).toHaveProperty('box_id', null);
    expect(response.body).toHaveProperty('user_id', userId);
  });
});

#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_simple_ast_1 = require("ts-simple-ast");
const ast = new ts_simple_ast_1.default();
/**
 * Create index.ts
 */
const port = 4002;
const INDEX = `
import { App } from './app';
import { Container } from 'typescript-ioc';

const app = Container.get(App);
app.start(${port});
`;
/**
 * Create app.ts
 */
const APP = `
import { Postgres } from './services/postgres.service';
import { Container, Inject, Singleton } from "typescript-ioc";
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';

export class App{
    
        private app = new Koa();
        private router = new Router();
        private socket:any;
    
        constructor(
            @Inject private postgres: Postgres
        ){
            this.middlewares();
            this.routes();
        }
    
        private middlewares(){
            this.app.use(bodyParser());
        }
    
        private routes(){
            this.app.use(this.router.routes());
        }
    
        public start(port: number){
            console.log(\`Listen on port \$\{port\}\`);
        }
    
    }
`;
const SERVICE_POSTGRES = `
import { Singleton } from 'typescript-ioc';
import { createConnection, Connection } from 'typeorm';
import Rating from '../models/rating.model';

@Singleton
export class Postgres{
    
    private connection:Connection;

    constructor(){        
        createConnection({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
            entities: [
                Rating
            ],
            synchronize: true,
            logging: false
        })
        .then( (_connection) => {
            this.connection = _connection;
        });
    }
    
    getRepository(model: any){
        if(this.connection){
            return this.connection.getRepository(model);
        }else{
            return null;
        }
    }
}
`;
const SERVICE_RATING = `
import { Singleton, Inject } from 'typescript-ioc';
import { Postgres } from './postgres.service';
import { App } from '../app';
import Rating from '../models/rating.model';

@Singleton
export default class RatingService {
    constructor(@Inject private postgres: Postgres){

    }

    public async findAll(): Promise<Array<any>> {
        const repository = await this.postgres.getRepository(Rating);
        return await repository.find();
    }

    public async save(rating: any): Promise<any> {
        const repository = await this.postgres.getRepository(Rating);
        return await repository.save(rating);
    }

}
`;
const MODEL_RATING = `
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Rating {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public rate: number;
}
`;
const CONTROLLER_RATING = `
import { Container, Inject, Singleton } from "typescript-ioc";
import * as Router from "koa-router";
import { BaseController } from './../base/controller.base';
import RatingService from "../services/rating.service";

@Singleton
export default class RatingController extends BaseController{
    

    constructor(@Inject private ratingService: RatingService){
        super();
        this.router.get('/ratings', this.get);
        this.router.post('/ratings', this.post);
    }

    get = async (ctx: any) => {
        ctx.body = await this.ratingService.findAll();
        ctx.status = 200;
        return ctx;
    }
    
    post = async (ctx: any) => {
        const body = ctx.request.body;
        console.log(body.rate);
        if(body.rate !== null){
            ctx.body = await this.ratingService.save(ctx.request.body);
            ctx.status = 201;
        }else{
            ctx.body = {
                message: 'unprocessable entity' 
            }
            ctx.status = 422;
        }
        return ctx;
    }
}
`;
const BASE_CONTROLLER = `
import * as Router from 'koa-router';

export class BaseController{
    protected router = new Router();
    public getRoutes(){
        return this.router.routes();
    }
}
`;
const DOCKER_DEV = `
FROM node:8.6.0-alpine

RUN npm install -g ts-node
RUN npm install -g typescript
RUN npm install -g nodemon
WORKDIR /usr/app
CMD ["nodemon","--config", "nodemon.config.json"]
`;
const index$ = ast.addSourceFileFromText('src/test/index.ts', INDEX);
const app$ = ast.addSourceFileFromText('src/test/app.ts', APP);
const services_postgres$ = ast.addSourceFileFromText('src/test/services/postgres.service.ts', SERVICE_POSTGRES);
const services_rating$ = ast.addSourceFileFromText('src/test/services/rating.service.ts', SERVICE_RATING);
const model_rating$ = ast.addSourceFileFromText('src/test/models/rating.model.ts', MODEL_RATING);
const controllers_rating$ = ast.addSourceFileFromText('src/test/controllers/ratings.controller.ts', CONTROLLER_RATING);
const base_controller$ = ast.addSourceFileFromText('src/test/base/controller.base.ts', BASE_CONTROLLER);
const docker_dev$ = ast.addSourceFileFromText('src/test/Dockerfile.dev', DOCKER_DEV);
const files = [
    index$,
    app$,
    services_postgres$,
    services_rating$,
    model_rating$,
    controllers_rating$,
    base_controller$,
    docker_dev$
];
files.forEach((file) => {
    file.save();
});
//# sourceMappingURL=fildji.js.map
import { indexCreator } from './../create/index.create';
import {Command, command, param} from 'clime';
import * as inquirer from 'inquirer';

const name = {
    description: 'Your loud name',
    required: true,
};

@command({
    description: 'This is a command for printing a greeting message',
})
export default class extends Command {
    async execute(@param(name) name: string) {
        const index = new indexCreator();
        // index.save();
        return `Hello, ${name}!`;
    }
}
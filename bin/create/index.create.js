"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class indexCreator {
    constructor() {
        this.name = 'src/index.ts';
        /*const file =  this.file
             .import('App').from('./app')
             .class('Hello')
                 .method('add')
                     .arg('num').type('number')
                     .body(`
                         console.log('test');
                     `)
                 .method('get')
                     .arg('num').type('App')
                     .body(`
                         console.log('test');
                     `);
             */
        //const hello = file.class('Hello');
        //hello.method('add').delete();
        //hello.method('get').rename('hello');
    }
}
exports.indexCreator = indexCreator;
function _import(_module, objects) {
    return {
        moduleSpecifier: _module,
        namedImports: objects.map((name) => {
            return {
                name
            };
        })
    };
}
//# sourceMappingURL=index.create.js.map
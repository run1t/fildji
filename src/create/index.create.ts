
export class indexCreator{

    private name = 'src/index.ts';

    constructor(){
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

function _import(_module: string, objects: Array<string>){
    return {
        moduleSpecifier: _module,
        namedImports: objects.map((name) => {
            return  {
                name
            }
        })
      };
}
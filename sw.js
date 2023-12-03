
//COmenzamos a definir las variables de los caches.
const CACHE ='ejemplo';
const CACHE_DINAMICO ='dinamico-1';
const CACHE_INMUTABLE ='The_best_f**ing_cache_the_10C';
//Agregamos el primer ache y con eso, agregmos los archivos que queramos  guardar en el chache.
self.addEventListener('install', evento=>{
    const promesa =caches.open(CACHE)
    .then(cache=>{
    return cache.addAll([
        //'/',
        'index.html',
        'css/icons.css',
        'css/googleapi.css',
        'manifest.json',
        'js/bootstrap.min.js',
        'js/application.js',
        'js/app.js',
        '/images/error-404.jpg',
        'offline.html',
        'form.html'
    ]);
    });

    // Establecemos los archivos que guardaremos en elcache dinamico.
    const cacheInmutable =  caches.open(CACHE_INMUTABLE)
        .then(cache => cache.addAll([
            'css/bootstrap.min.css',
            'css/styles.css',
            'css/londinium-theme.css'
        ]));
            

        evento.waitUntil(Promise.all([promesa,cacheInmutable]));
});

self.addEventListener('fetch', evento => {  
    //Estrategia 2 CACHE WITH NETWORK FALLBACK
    const respuesta=caches.match(evento.request)
        .then(res=>{
        //Agregamos un if, para retornar el archivo y si no exixte debe ir a la web para solicitar el archivo y despues
        //guardar el archivo.
            if (res) return res;
                     console.log('No existe', evento.request.url);
                return fetch(evento.request)
                .then(resWeb=>{
                //El cache es recuperado y almacenado en la web, va a pregntar si esta en la web y si lo esta lo almacena en el cache
                    caches.open(CACHE_DINAMICO)
                .then(cache=>{
                //se sube el archivo descargado de la web
                     cache.put(evento.request,resWeb);
                     //Limpiamos el cache y lo limitamos a solo almacenar 5 archivos
                        limpiarCache(CACHE_DINAMICO,5);
                })
            return resWeb.clone();
            });
        })
        .catch(err => {
            //si ocurre un error, en nuestro caso no hay conexión, la captar y despues mandara a la pagina 
            // offline, y a la imagen de error-404 las cuales estan almacenadas en cache y se visualizan los archivos.
            if(evento.request.headers.get('accept').includes('text/html')){
            return caches.match('/offline.html');
            }else if(evento.request.headers.get('accept').includes('png')){
                return caches.match('images/error-404.jpg');
                }
                //Atrapamos el error, lo que hara que en vez de mandarte al navegador te mandara a la pagina ya programada
            });   
            evento.respondWith(respuesta);
            function limpiarCache(nombreCache, numeroItems){
                //abrimos el cache
                caches.open(nombreCache)
                    .then(cache=>{
                        return cache.keys()
                            .then(keys=>{
                                if (keys.length>numeroItems){
                                    cache.delete(keys[0])
                                    .then(limpiarCache(nombreCache, numeroItems));
                }
                });
                });
            }
        
            });
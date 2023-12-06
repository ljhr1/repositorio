
const CACHE ='cache';
const CACHE_DINAMICO ='dinamico-1';
const CACHE_INMUTABLE ='Inmutable';

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
        '/images/error.jpg',
        'offline.html',
        'form.html'
    ]);
    });

    const cacheInmutable =  caches.open(CACHE_INMUTABLE)
        .then(cache => cache.addAll([
            'css/bootstrap.min.css',
            'css/styles.css',
            'css/londinium-theme.css'
        ]));
        evento.waitUntil(Promise.all([promesa,cacheInmutable]));
});
self.addEventListener('fetch', evento => {   
    const respuesta=caches.match(evento.request)
        .then(res=>{

            if (res) return res;
                     console.log('No existe', evento.request.url);
                return fetch(evento.request)
                .then(resWeb=>{
                    caches.open(CACHE_DINAMICO)
                .then(cache=>{
                     cache.put(evento.request,resWeb);
                        limpiarCache(CACHE_DINAMICO,5);
                })
            return resWeb.clone();
            });
        })
        .catch(err => {
            if(evento.request.headers.get('accept').includes('text/html')){
            return caches.match('/offline.html');
            }else if(evento.request.headers.get('accept').includes('png')){
                return caches.match('images/error-404.jpg');
                }
            });   
            evento.respondWith(respuesta);
            function limpiarCache(nombreCache, numeroItems){
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
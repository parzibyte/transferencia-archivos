# transferencia-archivos

La demostración y explicación están en mi blog: https://parzibyte.me/blog/2022/02/01/aplicacion-transferencia-archivos-gratuita-open-source/

# Requisitos
C:\Windows\system32>node -v
v20.15.1

C:\Windows\system32>npm -v
10.7.0

Si aparece ERR_SSL_CIPHER_OPERATION_FAILED lo que hice fue

Probé hacerlo 2 veces con node 20.11.0, no funcionó. Luego intenté borrar node_modules y npm cache clear --force, npm install. No funcionó

Probando con la 20.15.1, lo mismo, ERR cipher

Desconecté y conecté wifi, borré node_modules, npm cache clear --force, npm install. no funciona
Me conecté de nuevo al internet, npm cache verify, npm cache clear (me dijo que no es necesario), npm install y funcionó

Después instalé workbox con npm install workbox-cli --global, me dijo lo mismo:
npm error code ERR_SSL_CIPHER_OPERATION_FAILED
npm error errno ERR_SSL_CIPHER_OPERATION_FAILED
npm error Invalid response body while trying to fetch https://registry.npmjs.org/@babel%2fhelper-validator-option: 24050000:error:1C800066:Provider routines:ossl_gcm_stream_update:cipher operation failed:c:\ws\deps\openssl\openssl\providers\implementations\ciphers\ciphercommon_gcm.c:325:
npm error

Lo volví a ejecutar pero ahora me dijo:

npm warn cleanup     'C:\\Users\\parzibyte\\AppData\\Roaming\\nvm\\v20.15.1\\node_modules\\workbox-cli',
npm warn cleanup     [Error: EPERM: operation not permitted, lstat 'C:\Users\parzibyte\AppData\Roaming\nvm\v20.15.1\node_modules\workbox-cli\node_modules\es-abstract\2021\AddToKeptObjects.js'] {   
npm warn cleanup       errno: -4048,
npm warn cleanup       code: 'EPERM',
npm warn cleanup       syscall: 'lstat',
npm warn cleanup       path: 'C:\\Users\\parzibyte\\AppData\\Roaming\\nvm\\v20.15.1\\node_modules\\workbox-cli\\node_modules\\es-abstract\\2021\\AddToKeptObjects.js'
npm warn cleanup     }
npm warn cleanup   ]
npm warn cleanup ]
npm error code ERR_SSL_CIPHER_OPERATION_FAILED
npm error 10300000:error:1C800066:Provider routines:ossl_gcm_stream_update:cipher operation failed:c:\ws\deps\openssl\openssl\providers\implementations\ciphers\ciphercommon_gcm.c:325:
npm error

npm error A complete log of this run can be found in

Así que ejecuté npm cache verify, luego npm install workbox-cli --global y ya se pudo

# Convertir en PWA
Asumiendo que ya tienes workbox, ejecuta en la raíz del proyecto:
workbox generateSW workbox-config.js 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

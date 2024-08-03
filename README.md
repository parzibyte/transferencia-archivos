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

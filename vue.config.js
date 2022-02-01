module.exports = {
    productionSourceMap: false, // Deshabilitar generación de archivos map
    publicPath: process.env.NODE_ENV === 'production' ? '././' : './', // https://parzibyte.me/blog/2021/03/15/configurar-publicpath-vue-cli/
};
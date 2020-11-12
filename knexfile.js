module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'postgresql',
    connection: {
      host : 'ec2-34-237-247-76.compute-1.amazonaws.com',
      user : 'qtcnulmqeovcne',
      password : 'dcb0612d136363eea96a81bdb01cc664ea8195a91032e11f7edff2987bc1370f',
      database : 'd65qk5a1knpdr'
    }
  }
};

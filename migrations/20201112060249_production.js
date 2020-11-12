exports.up = function(knex) {
  return knex.schema.createTable('production', table => {
    table.increments('id');
    table.float('speed', 2).notNullable().comment('Velocidade do vento (m/s)');
    table.float('power', 2).notNullable().comment('Potencia (MWh)');
    table.integer('curve_id').notNullable();
    table.foreign('curve_id').references('curves.id').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('production');
};

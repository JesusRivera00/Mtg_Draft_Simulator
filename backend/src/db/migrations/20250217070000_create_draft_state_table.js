exports.up = function(knex) {
  return knex.schema.createTable('draft_state', function(table) {
    table.increments('id').primary();
    table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
    table.json('packs').notNullable(); // Store the packs as JSON
    table.json('picks').notNullable(); // Store the picks as JSON
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('draft_state');
};
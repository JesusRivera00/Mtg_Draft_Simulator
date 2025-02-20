exports.up = function(knex) {
  return knex.schema.createTable('room_players', function(table) {
    table.increments('id').primary();
    table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
    table.string('user_id').nullable(); // Store Supabase user ID as a string
    table.boolean('is_bot').notNullable().defaultTo(true);
    table.integer('seat_index').unsigned().notNullable(); // 0..7 for 8 seats
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('room_players');
};
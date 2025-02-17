exports.up = function(knex) {
    return knex.schema.createTable('decks', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
      table.json('cards').notNullable(); // Store the deck cards as JSON
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('decks');
  };
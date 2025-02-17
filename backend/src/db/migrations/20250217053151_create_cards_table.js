exports.up = function(knex) {
    return knex.schema.createTable('cards', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('scryfall_id').notNullable().unique();
      table.json('data').notNullable(); // Store the card data as JSON
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('cards');
  };
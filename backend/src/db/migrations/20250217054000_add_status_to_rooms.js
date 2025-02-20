exports.up = function(knex) {
  return knex.schema.table('rooms', function(table) {
    table.string('status').defaultTo('waiting'); // 'waiting', 'drafting', 'completed'
  });
};

exports.down = function(knex) {
  return knex.schema.table('rooms', function(table) {
    table.dropColumn('status');
  });
};
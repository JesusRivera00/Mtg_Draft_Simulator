exports.up = function(knex) {
  return knex.schema.table('rooms', function(table) {
    table.string('set_name');
  });
};

exports.down = function(knex) {
  return knex.schema.table('rooms', function(table) {
    table.dropColumn('set_name');
  });
};
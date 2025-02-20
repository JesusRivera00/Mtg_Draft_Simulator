exports.up = function(knex) {
  return knex.schema.table('draft_state', function(table) {
    table.integer('current_round').defaultTo(0);
    table.integer('user_pack_index').defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table('draft_state', function(table) {
    table.dropColumn('current_round');
    table.dropColumn('user_pack_index');
  });
};
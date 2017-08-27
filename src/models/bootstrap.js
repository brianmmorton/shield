import sequelize from 'sequelize';

export default async function bootstrapModels (db) {

  try {
    await bootstrapSessions(db);
    return true
  }
  catch (error) {
    console.log();
  }
}

function bootstrapSessions (db) {
  try {
    return db.query(`
      CREATE TABLE IF NOT EXISTS "user_sessions" (
        "sid" varchar NOT NULL COLLATE "default",
      	"sess" json NOT NULL,
      	"expire" timestamp(6) NOT NULL
      )
      WITH (OIDS=FALSE);
      ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
    `, { type: sequelize.QUERY });
  }
  catch (err) {
    return null
  }
}

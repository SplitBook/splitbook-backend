echo "RUN INITIALIZATION"
sleep 45s
echo "START KNEX"
npx knex migrate:latest && npx knex seed:run
echo "END KNEX"
npm start

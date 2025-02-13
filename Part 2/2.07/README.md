# Exercise 2.07: Stateful applications
Run a Postgres database and save the Ping-pong application counter into the database.

The Postgres database and Ping-pong application should not be in the same pod. A single Postgres database is enough and it may disappear with the cluster but it should survive even if all pods are taken down.

Hint: it might be a good idea to ensure that the database is operational and available for connections before you try connecting it from the Ping-pong app. For that purpose, you might just start a stand-alone pod that runs a Postgres image:

  kubectl run -it --rm --restart=Never --image postgres psql-for-debugging sh
  $ psql postgres://yourpostgresurlhere
  psql (16.2 (Debian 16.2-1.pgdg120+2))
  Type "help" for help.
  postgres=# \d
  Did not find any relations.
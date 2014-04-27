Greppy is able to easily build cluster applications with multiple contexts and
bundled modules. Any context should da exactly one job, e.g. serve a website, a
administration frontend, a REST service or something similar. There are some
usecases where you need to communicate between these contextes on the same
physical machine. This is called **Interprocess Communication**, or IPC.

Greppy gives you the posibility to define IPC API's. This could let a worker of
a administration context talk to the master of this context. So you could build
a special mechanism to lock a system resource, log an interaction a user do or
collect data for a statistic. There a plenty of other usecases you could build
with the help of IPC.


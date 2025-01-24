# Exercise 1.10: Even more services
Split the "Log output" application into two different containers within a single pod:

One generates a new timestamp every 5 seconds and saves it into a file.

The other reads that file and outputs it with a hash for the user to see.

Either application can generate the hash. The reader or the writer.

`kubectl logs log-output-split-dep-7f4ccd676f-44xx4 log-output-reader`

```
Reader: Timestamp - 2025-01-24T15:23:07.243Z, Hash - f1515078e78d5f51c2d8d21d447d93a5300a784e63114d8128c46c966fcfc505
Reader: Timestamp - 2025-01-24T15:23:11.760Z, Hash - 479cc4de241dcabdafc8b21718ed946dce291dcabe9f7fe48b9490464520c3fc
Reader: Timestamp - 2025-01-24T15:23:16.267Z, Hash - 7aa442d3d75ae0b6f59306056596c5cf96d62ab7563b4d23c89460593d865c9a
```

`kubectl logs log-output-split-dep-7f4ccd676f-44xx4 log-output-writer`

```
Writer: Generated timestamp - 2025-01-24T15:23:02.750Z
Writer: Generated timestamp - 2025-01-24T15:23:07.243Z
Writer: Generated timestamp - 2025-01-24T15:23:11.760Z
Writer: Generated timestamp - 2025-01-24T15:23:16.267Z
Writer: Generated timestamp - 2025-01-24T15:23:20.773Z
Writer: Generated timestamp - 2025-01-24T15:23:25.260Z
```
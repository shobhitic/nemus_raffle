### Nemus Raffle Tool

First, make sure you node, and NPM (or yarn) installed.

After that, run

```
npm install
````

or 

```
yarn install
```

This should install the dependencies needed.

Create a CSV file with `address` as the file first row and addresses as the next rows.

Something like this :-

```csv
address
vitalik.eth
ignorethis.eth
0xcA99FEeb796E34fbE9c89AaD089970b37D39555e
0xDB0A657D2A220E4Ee8C383cDa55317F153F96E25
abcd.eth
0xDB0A657D2A220E4Ee8C383cDa55317F153F96E25
...
```

Make sure to have at least 125 valid entries.

After that, put the CSV file in the same folder as index.js, and run `node index.js ./CSVFILE.csv` where `CSVFILE` is the name of your CSV file. The program will output random winners on the screen.
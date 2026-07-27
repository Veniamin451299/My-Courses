function argSum(arr) {
    const sum = arr.slice(2).reduce((acc, curr) => acc + Number(curr), 0);
    return Math.floor(sum);
}
console.log(argSum(process.argv));
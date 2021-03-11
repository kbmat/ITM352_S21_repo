/* steps */
m = 11;
d = 8;
y = 2000;
ys = String(y);

step1 = Number(ys[2]+ys[3]);
step2 = Math.floor(step1/4);
step3 = step2 + step1;
step4 = step3 + 3;
step6 = step4 + step3;
step7 = step6 + d;
step8 = step7 - 1;
step8%7;

/* node inputs

> m = 11
11
> d = 8
8
> y = 2000
2000
> ys = String(y)
'2000'
> step1 = Number(ys[2]+ys[3])
0
> step2 = Math.floor(step1/4)
0
> step3 = step2 + step1
0
> step4 = step3 + 3
3
> step6 = step4 + step3 
3
> step7 = step6 + d
11
> step8 = step7 - 1
10
> step8%7
3
*/
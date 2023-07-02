int foo1(int a, int b) {
    if (a == 0) {
        if (b == 0) {
            return 1;
        } else {
            return 2;
        }
    } else {
        if (b == 3) {
            return 3;
        } else {
            return 4;
        }
    }
}

int foo2(int x, int z) {
    int y = x + 2;
    printf("************** x = %d, y = %d, z = %d **************\n",x,y,z);
    if(0 < y && z == 0) {
        while(5 > y) {
            if(y % 2 != 0){
                z += 1;
                printf("************** path 1 *************\n");
            } else {
                z += 2;
                printf("************** path 2 *************\n");
            }
            y++ ;
       }
    } else {
       printf("************** path 3 *************\n");
    }

    z = y / z;

    return 0;
}

int main() {
    return 0;
}

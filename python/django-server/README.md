## For Mysql Database, One needs to follow these steps..
1. connect to your mysql database with 'root' user and it's password
2. CREATE USER 'zylobackend'@'localhost' IDENTIFIED BY 'd@t@zyl0';
3. GRANT ALL PRIVILEGES ON * . * TO 'zylobackend'@'localhost';
4. FLUSH PRIVILEGES;

## If you get 'Your password does not satisfy the current policy requirements' in step 2, then do this steps
1. SET GLOBAL validate_password_number_count = 0;
2. SET GLOBAL validate_password_mixed_case_count = 0;
3. SET GLOBAL validate_password_special_char_count = 0;


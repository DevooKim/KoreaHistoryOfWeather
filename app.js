const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const path = require('path')

const weatherRouter = require('./routes/weatherRouter')
const loggingRouter = require('./routes/testLogger')

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/weather', weatherRouter);
app.use('/test', loggingRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`); //추후 제거
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.send(err);
});

app.listen(app.get('port'), (err) => {
    if (!err) {
        console.log(app.get('port'), '번 포트에서 대기 중');
        //loggingRouter;
    } else {
        console.log('서버 오류');
        throw new Error('서버 오류', err);
    }
});

const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = path.join(__dirname,'test.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase:true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const test_proto = protoDescriptor.kokaze
module.exports = test_proto
const vscode = require('vscode');
const PROTO_PATH = __dirname + '/test.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
const test_proto = grpc.loadPackageDefinition(packageDefinition).kokaze;
module.exports = test_proto
/*const path = require('path')
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
module.exports = test_proto */
var client = new test_proto.pluginService('localhost:50000',
                                       grpc.credentials.createInsecure())
function cppCheck(filename) {
    client.cppCheck(filename,(err,response)=>{
        if(err){
            vscode.window.showErrorMessage(err);
        }else{
            vscode.window.showInformationMessage(response.content);
            var output_channal = vscode.window.createOutputChannel('plugin');
            output_channal.clear();
            output_channal.append(response.output);
            output_channal.show();
        }
    });
}

//export async function showTest(filename, line) {
//    // 转换路径
//    let fullPath = vscode.Uri.parse(filename);
//    let lineNumber = line;
//    // 打开文件
//    await vscode.workspace.openTextDocument(fullPath)
//    .then(async doc => {
//      // 获取当前打开的文件的editor 
//      let editor = vscode.window.activeTextEditor;
//      if (!editor) {
//        return;
//      }
//      //从editor 中拿document。
//      let document = editor.document;
//      // 调用document的lineAt获取某行代码的range。
//      let start = document.lineAt(lineNumber).range.start.character;
//      let end = document.lineAt(lineNumber).range.end.character;
//      // 组装range。
//      let range: vscode.Range = new vscode.Range(lineNumber, start, lineNumber, end);
//      //高亮！！！
//      await vscode.window.showTextDocument(doc , {preserveFocus: false, selection: range, viewColumn: vscode.ViewColumn.One});
//    });
//}
function hl(searchtext,text) {
    // 正则表达式 需要被替换的数据是一个变量时声明正则表达式对象
    const reg = new RegExp(searchtext, 'gi')
    const highStr = `<span class="active"">${searchtext}</span>`
    return text.replace(reg, highStr)
    }



function highLight(filename) {
    client.highLight(filename,async (err,response)=>{
            let decorationType = vscode.window.createTextEditorDecorationType({
                backgroundColor: '#bbd0353d'
            });
            let editor = vscode.window.activeTextEditor;
                //const path = '/home/gao/main/test.c';
            var lines = [];
            for(var i=0;i<response.content.length;i++){

                var line = response.content[i]-1;
                lines.push(new vscode.Range(line, 0, line, 100));
            }
            console.log(lines)
            editor.setDecorations(decorationType, lines);

            vscode.window.showInformationMessage(response.title);
            
        });
}

module.exports = {
    cppCheck,
    highLight
}
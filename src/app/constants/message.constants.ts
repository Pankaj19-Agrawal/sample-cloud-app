export class MessageConstant{
    public static APP_TITLE = 'Risk Annotation';
    public static TOGGLE_BUTTON_ONE = 'Show Document';
    public static TOGGLE_BUTTON_TWO = 'Show Table';
    public static DOWNLOAD_DOCUMENT = 'Download';
    public static UPLOAD_BUTTON = 'Upload';
    public static TABLE_HEADER = {'header0':'S.No.', 'header1':'Category', 'header2':'Text', 'header3':'Probability'};
    public static JSON_PROPERTIES = ['sno','category','probability','value','action'];
    public static FILE_NAME = {'name1':'Sample','default':'Document'};
    public static FILE_TYPE = {'type1':'.doc','default':'.doc'};
    public static DIALOG_BUTTON = {'ok':'Update','cancel':'Cancel','add':'Add','delete':'Delete'};
    public static DIALOG_WIDTH = '400px';
    public static TOAST_MESSAGE = {'success':'File Uploaded Successfully !','fail':'Error'};
    public static HEADER_IMG_PATH = '../assets/us-deloitte-logo.png';
    public static INVALID_CREDENTIALS = 'Invalid Username/Password';
    public static DOCUMENT_TEXT_ONLY = 'Please select text from document only';
    public static DELETE_MESSAGE = 'Are you sure you want to delete?';
    public static RETRAINING_SUCCESS = 'Saved Successfully !';
    public static INVALID_CHARACTERS = ['`','~','!','@','#','$','%','^','&','*','{','}','|','?','<','>','/'];
    public static FILENAME_VALIDATION = 'File Name Should Not Contain These Special Characters  `, ~, !, @, #, $, %, ^, &, *, {, }, |, ?, <, >, /';
}
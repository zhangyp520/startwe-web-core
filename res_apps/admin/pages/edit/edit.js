$(document).ready(function()
{
    $('.article-editor').summernote({
        height: 500,
        tabsize: 2,
        lang: 'zh-CN'
    });

    $('.btn-save').click(function()
    {
        var a = $('.article-editor').summernote('code');
        console.log(a);
    });
});
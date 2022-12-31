$(document).ready(function()
{

    imgLoad();

});

function imgLoad()
{
    var lazyLoadImg = new LazyLoadImg({
        el: $('.rmd-article-list')[0],
        mode: 'default',
        time: 300,
        complete: true,
        position: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        success: function(el)
        {
            el.classList.add('success');
        },
        error: function(el)
        {
            el.src = 'src/common/image/img-error.png';
        }
    });
}
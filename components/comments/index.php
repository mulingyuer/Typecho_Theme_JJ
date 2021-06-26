<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<?php //自定义回复列表?>
<div id="comments">
  <?php //开启评论?>
  <?php if ($this->allow('comment')) : ?>
    <?php //评论表单?>
    <?php $this->need("components/comments/form.php");?> 
    <?php //评论列表 模板->$comments对象->渲染?>
    <?php if($this->commentsNum >= 1):  ?>
    <div id="my-custom-comment">
      <?php $this->need("components/comments/list-template.php");?>  
      <?php $this->comments()->to($comments); ?>
      <?php $comments->listComments(); ?>
    </div>
    <?php endif;?>
    <?php //评论分页?>
    <?php $this->need("components/comments/pagination.php");?>   
  <?php else: ?>
    <?php //关闭评论?>
    <div class="off-comment">
      <h4 class="info">评论已关闭</h4>
    </div>
  <?php endif;?>
</div>
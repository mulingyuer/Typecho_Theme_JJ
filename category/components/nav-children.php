<?php //分类收缩菜单?>
<?php $this->widget('Widget_Metas_Category_List')->to($categorys);?> 
  <?php while ($categorys->next()): ?>
  <?php if ($this->category == $categorys->slug && ($this->is("post") || $this->is("category"))): ?>
    <?php $childrens = $this->widget('Widget_Metas_Category_List')->getAllChildren($categorys->parent);?>
    <?php if(count($childrens)): ?>
    <div id="category-nav-children">
      <div class="container">
        <div class="children-warp">
          <div class="more">
            <div class="btn open show">展开<i class="icon icon-caret-down"></i></div>
            <div class="btn close">收起<i class="icon icon-caret-up"></i></div>
          </div>
          <div class="content">
            <?php for ($i=0; $i <count($childrens) ; $i++): ?>
              <?php $thisChild = $this->widget('Widget_Metas_Category_List')->getCategory($childrens[$i]);?>
              <a class="<?php if(!$this->is('index') && isMidInArray(array($thisChild["mid"]),$this->categories)) echo 'active';?>" href="<?php echo $thisChild["permalink"] ?>">
                <?php echo $thisChild["name"]; ?>
              </a>
            <?php endfor;?>
          </div>
        </div>
      </div>
    </div>
    <?php else: ?>
    <div id="category-nav-placeholder"></div>
    <?php endif;?>
  <?php endif; ?>
<?php endwhile;?>
<?php $this->widget('Widget_Metas_Category_List')->to($category);?>
<?php while ($category->next()): ?>
  <?php if ($this->category === $category->slug): ?>
    <?php $children = $this->widget('Widget_Metas_Category_List')->getAllChildIds($category->parent);?>
    <?php if (!is_array($children)) {$children = array();}?>
      <?php if (count($children)): ?>
      <div class="secondary-nav">
          <div class="secondary-nav-content">
            <div class="secondary-nav-fold">
              <div class="secondary-nav-left">
                <?php $allCategory = $category->getRow($category->parent > 0 ? $category->parent : $category->mid);?>
                <?php if ($allCategory !== null): ?>
                <a class="secondary-nav-item<?php if (secondaryAllActive($this, $category, $children)) {echo ' active';}
;?>" href="<?php echo Typecho\Router::url('category', $allCategory, Helper::options()->index); ?>" target="_self" title="全部">全部</a>
                <?php endif;?>
                <?php foreach ($children as $mid) {?>
                <?php $child = $category->getRow($mid);?>
                <?php if ($child === null) {continue;}?>
                <a class="secondary-nav-item<?php if ($this->is('category', $child['slug'])) {echo ' active';}
    ;?>" href="<?php echo Typecho\Router::url('category', $child, Helper::options()->index); ?>" target="_self" title="<?php echo $child['name']; ?>"><?php echo $child['name']; ?></a>
                <?php }?>
              </div>
              <div class="secondary-nav-right">
                <button class="secondary-nav-fold-btn">
                  <span class="secondary-nav-fold-btn-unfurl">展开</span>
                  <span class="secondary-nav-fold-btn-retract">收起</span>
                  <i class="jj-icon jj-icon-down secondary-nav-fold-btn-icon"></i>
                </button>
              </div>
            </div>
          </div>
      </div>
    <?php endif;?>
  <?php endif;?>
<?php endwhile;?>


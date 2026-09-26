<nav class="nav">
  <div class="nav-container">
    <div class="nav-content">
      <div class="nav-list">
        <?php $this->widget('Widget_Metas_Category_List')->to($category);?>
        <?php while ($category->next()): ?>
          <?php if ($category->levels === 0): ?>
            <?php $children = $category->getAllChildren($category->mid);?>
            <?php if (empty($children)): ?>
              <a class="nav-list-item<?php if ($this->is('category', $category->slug)) {echo ' active';}?>" href="<?php $category->permalink();?>" target="_self" title="<?php $category->name();?>"><?php $category->name();?></a>
            <?php else: ?>
              <div class="nav-list-item nav-list-item-parent<?php if (!$this->is('index') && isParentActive($this->category, $category, $children)) {echo ' active';}?>">
                <a class="nav-list-item-parent-name" href="<?php $category->permalink();?>" target="_self" title="<?php $category->name();?>"><?php $category->name();?></a>
                <div class="nav-list-secondary">
                  <?php foreach ($children as $mid) {?>
                  <?php $child = $category->getCategory($mid);?>
                  <a class="nav-list-secondary-item<?php if ($this->is('category', $child['slug'])) {echo ' active';}
    ;?>" href="<?php echo $child['permalink'] ?>" target="_self" title="<?php echo $child['name']; ?>"><?php echo $child['name']; ?></a>
                  <?php }?>
                </div>
              </div>
            <?php endif;?>
          <?php endif;?>
        <?php endwhile;?>
      </div>
    </div>
  </div>
  <div class="nav-secondary-warp"></div>
</nav>
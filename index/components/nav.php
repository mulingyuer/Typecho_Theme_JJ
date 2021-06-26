<?php //导航菜单?>
<div class="main-nav">
  <div class="left index-nav-warp">
    <div class="nav-content">
      <?php $this->widget('Widget_Metas_Category_List')->to($categorys); ?>
      <?php while ($categorys->next()) : ?>
        
        <?php if ($categorys->levels === 0) : ?>
          <?php $children = $categorys->getAllChildren($categorys->mid); ?>
          <?php if (empty($children)) : ?>
          <?php //无子菜单?>
            <a class="nav-item <?php if(!$this->is('index') && isMidInArray(array($categorys->mid),$this->categories)){echo 'active';}; ?>" href="<?php $categorys->permalink();?>" title="<?php $categorys->name(); ?>"><?php $categorys->name(); ?></a>
          <?php else : ?>
             <!-- <?php print_r($this->categories);?> -->
            <?php //有子菜单?>
              <div class="nav-item tooltip <?php if(!$this->is('index') && isMidInArray($children,$this->categories)) echo 'active';?>" data-link="<?php $categorys->permalink();?>">
                <?php $categorys->name(); ?>
                <div class="index-nav-tooltip">
                  <?php foreach ($children as $mid) { ?>
                    <?php $child = $categorys->getCategory($mid); ?>
                    <a class="<?php if(!$this->is('index') && isMidInArray(array($mid),$this->categories)) echo 'active';?>" 
                      href="<?php echo $child['permalink'] ?>" title="<?php echo $child['name']; ?>">
                      <?php echo $child['name']; ?>
                    </a>
                  <?php } ?>
                </div>
              </div>
          <?php endif;?>
        <?php endif; ?>
      <?php endwhile; ?>
    </div>
  </div>
  <?php if($this->user->hasLogin()): ?> 
  <a class="nav-item right-config" href="<?php $this->options->siteUrl(); ?>admin/manage-categories.php">分类管理</a>
  <?php endif;?>
</div>
<template>
  <div class="wrap">
    <var-card
      elevation="0"
      @click="this.$router.push(`/special/column/${column.id}`)"
      class="card"
      :subtitle="this.$calc.filters.date(column.comment_time)"
      :title="column.title"
      :description="column.description"
    >
      <template #extra>
        <div class="tags">
          <a-tag class="tag" checkable color="arcoblue" size="small" v-for="tag in column.tag">{{tag.name}}</a-tag>
        </div>
        <div class="foot">
          <div class="author" @click.stop="this.$router.push(`/user/${column.author.id}`)">{{column.author.username}}
          </div>
          <div class="interact">
            <icon-eye class="icon"/>
            <div class="number">{{column.view_num}}</div>
            <icon-message class="icon"/>
            <div class="number">{{column.comment_num}}</div>
            <icon-thumb-up class="icon"/>
            <div class="number">{{column.up_num}}</div>
          </div>
        </div>

      </template>
    </var-card>
  </div>
</template>

<script>
  export default {
    name: "ColumnCard",
    props: {
      column: null
    }
  }
</script>

<style scoped>
  .card {
    --card-subtitle-font-size: 12px;
    --card-subtitle-margin: 0;
    --card-description-margin: 5px 0 0 0;
    --card-title-font-size: 17px
  }

  .tags {
    margin: 6px 10px 3px;
  }

  .tag {
    margin: 0 2px;
  }

  .foot {
    padding: 0 0 6px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .author {
    color: #888;
  }

  .interact {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .number {
    margin: 0 12px 0 3px;
    color: #888;
  }

  .icon {
    font-size: 20px;
    color: #888;
  }


</style>
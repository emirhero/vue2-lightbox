const dataUrl = "https://demo2070301.mockable.io/articles";
var commentsUrl = "https://jsonplaceholder.typicode.com/comments"; 
Vue.config.devtools = true;
Vue.config.debug = true

const globalStore = new Vuex.Store({
  state: {
    currentArticleId: 1,
    currentArticle: {},
    articles: [],
    comments: []
  },
  mutations: {
    nextArticle(state) {
      state.currentArticleId++;
    },
    prevArticle(state) {
      state.currentArticleId--;
    },
    setArticles(state, list) {
      state.articles = list;
      console.log(state.articles);
    },
    setComments(state, comments) {
      state.comments = comments;
      console.log(state.comments);
    }
  },
  actions: {
    loadArticles: function({commit, state}) {
      axios.get(dataUrl).then((response) => {
        commit('setArticles', response.data.articles)
      }, (error) => {console.log(error)});
    },
    
    loadComments: function({commit, state}) {
      axios.get(commentsUrl).then((response) => {
        commit('setComments', response.data);
      }, (error) => {console.log(error)});
    }
  },
  getters: {
    getCurrentArticle() {
      return globalStore.state.articles[globalStore.state.currentArticleId];
    },
    getCurrentComments() {
      return globalStore.state.comments.filter((comment) => {
        return comment.postId == globalStore.state.currentArticleId;
      });
    }
  }
});

Vue.component('title-block', {
  props: ['article'],
  template: `<div><h1>{{article.title}}</h1>
             <img :src="article.imageSrc" /></div>`
});

Vue.component('single-comment', {
  props: ['comment'],
  template: `<div><strong>{{comment.name}}</strong><br/>{{comment.body}}</div>`
});

new Vue({
  el: '#app',
  data: {},
  computed: {
    getArticle() {
      return globalStore.getters.getCurrentArticle;
    },
    getId() {
      return globalStore.state.currentArticleId;
    },
    getComments() {
      return globalStore.getters.getCurrentComments;
    }
  },
  methods: {
    next() {
      globalStore.commit('nextArticle');
    },
    prev() {
      globalStore.commit('prevArticle');
    }
  },
  mounted() {
    globalStore.dispatch('loadArticles');
    globalStore.dispatch('loadComments');
  }
});
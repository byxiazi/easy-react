import Home from '@/features/home/index'
import Login from '@/features/login'

export default {
  routes: [
    {
      path: '/', exact: true,  component: Home,
    },
    {path: '/login', component: Login}
  ]
}

import { defineComponent } from 'vue'
import { RouteRecordRaw, RouterLink, useRoute } from 'vue-router'
import classnames from 'classnames'
import { navRouter } from '@/router/index'
import { SidebarAuth } from '@/pages/auth/component/sidebar-auth'
import './index.less'

// TODO 登录页面 我先做成内嵌的模式，后续再升级成 electron 模式
export const Sidebar = defineComponent({
  name: 'Sidebar',
  setup() {
    const route = useRoute()
    return () => (
      <aside class="sidebar">
        <SidebarAuth></SidebarAuth>
        {navRouter.map((routerGroup: RouteRecordRaw) => {
          // TODO hack
          if (routerGroup.meta?.nonav) {
            return null
          }

          return (
            <div
              class={classnames('sidebar-nav', {
                'sidebar-nav-active': route.path.includes(routerGroup.path)
              })}
            >
              {routerGroup.meta?.beforeHeader && (
                <header class="sidebar-nav-header">
                  {routerGroup.meta.beforeHeader}
                </header>
              )}
              <RouterLink class="sidebar-nav-name" to={routerGroup.path}>
                {routerGroup.meta?.name}
              </RouterLink>
            </div>
          )
        })}
      </aside>
    )
  }
})

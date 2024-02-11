import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  path: string | undefined;
  menuTitle: any;
  constructor(private route: ActivatedRoute) {
    const currentUrl = this.route.snapshot.url;
    this.setMenuTitle(currentUrl[0].path);
  }

  setMenuTitle(path: string | null) {
    if (path) {
      const title: { [key: string]: string } = {
        fooldal: 'Hírek',
        adatok: 'Adatok',
        diktalas: 'Diktálás',
        koltsegek: 'Költségek',
        profilom: 'Profilom'
      };
      this.menuTitle = title[path];
    }
  }
}

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FetchProductsService } from 'src/app/services/fetch-products.service';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {

  products: any;
  productDetails: any;
  serverURL: String = "https://s3-us-west-2.amazonaws.com/seebiz-development/";
  p: number = 1;
  isProductDetails: boolean = true;
  mainImage: String;

  constructor(private aRoute: ActivatedRoute, private route: Router, private proService: FetchProductsService) {
    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url != '/') {
          this.isProductDetails = true;
          if (event.url.split('/')[2] === 'p') {
            this.proService.getProducts(event.url)
              .subscribe(
                (result: any) => {
                  this.products = result.data;
                },
                error => { console.log("Error in fetching products: ", error) },
                () => { console.log("Products Fetching complete.") }
              )
            this.isProductDetails = true;
          }
          else if (event.url.split('/')[2] !== 'p' && event.url.split('/')[1] === 'products') {
            this.isProductDetails = false;
            this.proService.getProductDetails(event.url)
              .subscribe(
                (result: any) => {
                  this.productDetails = result.data[0];
                  this.mainImage = this.serverURL + this.productDetails.product_images[0]['250'];
                },
                error => { console.log("Error in fetching product details: ", error) },
                () => { console.log("Product details Fetching complete.") }
              )
          }
        }
      }
    });
  }

  ngOnInit(): void {
  }

  cardClick(card) {
    console.log("Card Click", card._id);
    this.route.navigate([`/products/${card._id}`]);
  }

  changeMainImage(image) {
    this.mainImage = image.src;
  }

  ///////////////////////////////
  @ViewChild('myresult') resultID: ElementRef
  @ViewChild('myimage') imgID: ElementRef
  @ViewChild('zoomDiv') zoomDiv: ElementRef
  showZoom: boolean;
  showLens: boolean;
  imageZoom() {
    this.showLens = true;
    this.showZoom = true;
    this.showLensDiv();
    var img, lens, result, cx, cy;
    result = this.resultID.nativeElement;
    this.showLens = true;
    img = this.imgID.nativeElement;
    lens = this.zoomDiv.nativeElement;
    lens.style.opacity = 1;

    if (img.width > (img.height * 2)) {
      lens.style.width = (img.width / 3) + "px";
      lens.style.height = (img.height / 1) + "px";
    }

    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    img.src = img.src.replace("/250/", "/original/")
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
      var pos, x, y;
      e.preventDefault();
      pos = getPointerPosition(e);
      x = pos.x - (lens.offsetWidth / 2);
      y = pos.y - (lens.offsetHeight / 2);
      if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
      if (x < 0) { x = 0; }
      if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
      if (y < 0) { y = 0; }
      lens.style.left = (x + 5) + "px";
      lens.style.top = (y + 5) + "px";
      result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }
    function getPointerPosition(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      a = img.getBoundingClientRect();
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return { x: x, y: y };
    }
  }

  showZoomWin() {
    this.showZoom = true;
  }
  hideZoomWin() {
    this.showZoom = false;
    this.showLens = false;
    this.zoomDiv.nativeElement.style.opacity = 0;
    this.zoomDiv.nativeElement.style.display = 'none';
  }
  showLensDiv() {
    this.showLens = true;
    this.zoomDiv.nativeElement.style.display = 'block';
  }
}

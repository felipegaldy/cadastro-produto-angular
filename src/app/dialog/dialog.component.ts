import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {


  tipoProduto = ['Acessório','Smartphone','Automotivo']
  productForm !: FormGroup
  actionBtn : string = 'Save'
  constructor(private formBuilder : FormBuilder, 
    private api : ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<DialogComponent>  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName : ['',Validators.required],
      category: ['',Validators.required],
      type:['', Validators.required],
      price:['', Validators.required],
      comment:['', Validators.required],
      date:['',Validators.required],

    })
    if (this.editData){
      this.actionBtn = 'Atualizar'
      this.productForm.controls['productName'].setValue(this.editData.productName)
      this.productForm.controls['category'].setValue(this.editData.category)
      this.productForm.controls['type'].setValue(this.editData.type)
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }
  addProduct() {
    if(!this.editData){
    if(this.productForm.valid){
      this.api.postProduct(this.productForm.value)
      .subscribe({
        next:(res)=>{
          alert('Produto adicionado com sucesso')
          this.productForm.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
          alert('Erro ao adicoinar produto')
        }
      })    
    } 
  }
  else {
    this.updateProduct()
  }
  }

  updateProduct(): void{
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res) => {
        alert('Produto Atualizado')
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: () => {
        alert('Erro ao atualizar produto')
      }
    })
  }

}

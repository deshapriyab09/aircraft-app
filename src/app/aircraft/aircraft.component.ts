import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { AircraftVM } from '../Aircraft';
import { AircraftService } from '../aircraft.service';
import { AircraftDto } from '../AircraftDto';

@Component({
  selector: 'app-aircraft',
  templateUrl: './aircraft.component.html',
  styleUrls: ['./aircraft.component.scss']
})
export class AircraftComponent implements OnInit {
  datepickerConfig: Partial<BsDatepickerConfig>;

    
  aircraftForm: any;
  aircrafSearchtForm : any;
  public SearchText : any;
  fileToUpload: any;
  imagePath: string ;
  Date : any;
  
  public make: string;
  public model: string;
  public registration : string;
  public location: string;
  public date: string;

  public aircraft: AircraftDto;
  // public aircrafts: AircraftVM[] = [];

  public progress: number;
  public message: string;

  public response: {dbPath: ''};

  public aircraftVM: AircraftVM[]=[];

  // aircraftList1: Observable<AircraftVM[]>;
  // aircraftList: Observable<AircraftVM[]>;
  
  // aircraftList1: AircraftVM[];
  // aircraftList: AircraftVM[];

 
  aircraftId =0;
  d = 0;

  constructor(
    private formbulider: FormBuilder,
    public toastrService: ToastrService,
    // private httpClient: HttpClient,
    private aircraftService: AircraftService,
    private datePipe: DatePipe)
     { 
  this.datepickerConfig = Object.assign({},
    {
      containerClass: 'theme-dark-blue',
      showWeekNumbers: false,
      minDate: new Date(2021, 0, 11),
      maxDate : new Date(new Date().setDate(new Date().getDate()-1)),
      // dateInputFormat:'DD/MM/YYYY',
      dateInputFormat:'YYYY-MM-DD, h:mm: a'
    })
     }

  ngOnInit(): void {

    // this.aircraftVM = this.aircraftServiceService.NewAirCraft();

    this.aircraftForm = this.formbulider.group(
      {
        make: ['',[Validators.required, Validators.minLength(1)]],
        model:['',Validators.required],
        registration:['',Validators.required],
        location:['',Validators.required],
        photoPath: [''],
        tempImgPath:[''],
        dateTime:['',Validators.required]
      }
    )

    this.aircrafSearchtForm = this.formbulider.group(
      {
        search:['',Validators.required],
      }
    )

    this.GetAllAircraft();

  }

  //success message by toastr service

  Success(message: string) {
    this.toastrService.success(message);
  }

  //error message by toastr service

  Error(message: string) {
    this.toastrService.error(message);
  }

  get Make(){
    return this.aircraftForm.get('make')
  }


  // GetAllAircraft() {
  //   this.aircraftList1 = this.aircraftServiceService.GetAllAircraft()
  //   this.aircraftList = this.aircraftList1;
  // }

    GetAllAircraft() {
     this.aircraftService.GetAllAircraft().subscribe( 
       data => {
      // if (data.isSuccess) {
        console.log(data,"Dataa");
        this.aircraftVM = data;
    }
  )
  }
  
  PostAircraft(aircraft: AircraftVM){
    if(this.aircraftId==0){
    aircraft.photoPath=this.response.dbPath;
        this.aircraftService.AddAircraftData(aircraft).subscribe(
          () => {
            this.Success('Data Saved Successfully');
            this.GetAllAircraft();
            this.resetForm();
          }
        );
      }else{
        // aircraft.photoPath=this.response.dbPath;
        aircraft.photoPath=this.imagePath; //this.pathToSave+
        aircraft.id = this.aircraftId;
        this.aircraftService.UpdateAircraftData(aircraft).subscribe(
          () => {
          this.Success('Record Updated Successfully');
          this.GetAllAircraft();
          this.resetForm();
        });
      }
    }

  aircraftDetailsToEdit(id : number) { 
    //debugger;
    console.log(id,"Data");
    this.aircraftService.GetAircraftById(id).subscribe(aircraftResult => {
      this.aircraftId= aircraftResult.id;
      this.aircraftForm.controls['make'].setValue(aircraftResult.make);
      this.aircraftForm.controls['model'].setValue(aircraftResult.model);
      this.aircraftForm.controls['registration'].setValue(aircraftResult.registration);
      this.aircraftForm.controls['location'].setValue(aircraftResult.location);
      this.aircraftForm.controls['tempImgPath'].setValue(aircraftResult.photoPath);
      // this.aircraftForm.controls['dateTime'].setValue( aircraftResult.dateTime);
      this.aircraftForm.controls['dateTime'].setValue(this.datePipe.transform( aircraftResult.dateTime, 'YYYY-MM-dd')); 
      // this.aircraftForm.controls['dateTime'].setValue(this.datePipe.transform( aircraftResult.dateTime, 'dd/MM/yyyy hh:mm'));
      this.imagePath =  aircraftResult.photoPath;
      //('currentDate').split('T')[0];
      console.log(this.aircraftForm.controls,"Data");
    });
  }
  
  DeleteAircraft(id: number) {
    if (confirm('Do you want to delete this Record?')) {
      this.aircraftService.DeleteAircraftById(id).subscribe(() => {
        this.GetAllAircraft();
        this.resetForm();
      });
    }
  }

  SearchaircraftDetails(search: string) { 
    if(search==""){
      this.GetAllAircraft();
    }
    else{
       // console.log(id,"Data");
    this.aircraftService.SearchAircrafData(search).subscribe(aircraftResult => {
      console.log(aircraftResult,"aircraftResult");
     this.aircraftVM=aircraftResult;
   });
    }
   
  }
 
uploadFile(event:any) {
    if (event.target.files.length > 0) {
      let fileToUpload = event.target.files[0];

      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);

      this.aircraftService.AddAircrftPhoto(formData)
      .subscribe(event => {
        if (event.type === HttpEventType.Response) {
          this.message = 'Upload success.';
          this.uploadFinished(event.body);
          // this.response=event.body;
        }
      });
     
    }
  }

  public uploadFinished = (event:any) => {
    this.response = event;
    this.imagePath=this.response.dbPath;
    // this.pathToSave=this.response.pathToSave;
  }

  public createImgPath = (serverPath: string) => {
    // debugger;
    return `https://localhost:44309/${serverPath}`;
  }

 resetForm() {  
    this.aircraftForm.reset();
    this.aircraftId=0;
    // this.aircraft.photoPath='';
    this.imagePath='';
    this.message = '';
    this.uploadFinished(null);
    this.date=this.Date;
    // this.aircraftForm.  
    // this.dataSaved = false;  
  }  
}

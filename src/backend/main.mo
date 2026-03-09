import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  var nextId = 0;

  type LoanStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type LoanApplication = {
    id : Nat;
    name : Text;
    whatsapp : Text;
    email : Text;
    loanAmount : Text;
    purpose : Text;
    status : LoanStatus;
    submittedAt : Time.Time;
  };

  let loanApplications = Map.empty<Nat, LoanApplication>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Claim admin if no admin has been assigned yet (first-login flow)
  public shared ({ caller }) func claimAdminIfFirst() : async Bool {
    if (caller.isAnonymous()) { return false };
    if (accessControlState.adminAssigned) { return false };
    accessControlState.userRoles.add(caller, #admin);
    accessControlState.adminAssigned := true;
    true;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitApplication(
    name : Text,
    whatsapp : Text,
    email : Text,
    loanAmount : Text,
    purpose : Text,
  ) : async Text {
    let application : LoanApplication = {
      id = nextId;
      name;
      whatsapp;
      email;
      loanAmount;
      purpose;
      status = #pending;
      submittedAt = Time.now();
    };
    nextId += 1;

    loanApplications.add(application.id, application);
    "Application submitted successfully!";
  };

  public query ({ caller }) func getApplications() : async [LoanApplication] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can access this endpoint.");
    };
    loanApplications.values().toArray();
  };

  public shared ({ caller }) func updateStatus(id : Nat, newStatus : LoanStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can update status.");
    };

    switch (loanApplications.get(id)) {
      case (?application) {
        let updatedApplication = { application with status = newStatus };
        loanApplications.add(id, updatedApplication);
      };
      case (null) {
        Runtime.trap("Loan application not found");
      };
    };
  };

  public shared ({ caller }) func deleteApplication(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admin can delete applications.");
    };

    switch (loanApplications.get(id)) {
      case (null) {
        Runtime.trap("Loan application not found");
      };
      case (?_) {
        loanApplications.remove(id);
      };
    };
  };
};
